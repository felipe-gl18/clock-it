import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type AuthError,
  type User,
} from "firebase/auth";
import { auth, db, googleProvider, storage } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import type { Employee, EmployeeWithId } from "@/contexts/EmployeesContext";
import type {
  EmployeeTimeRecord,
  EmployeeTimeRecordFromFirebase,
  EmployeeTimeRecordWithId,
} from "@/contexts/EmployeeTimeRecordContext";
import { v4 as uuidv4 } from "uuid";

export const useFirebaseStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [downloadURL, setDownloadURL] = useState<null | string>(null);

  async function uploadImage(file: File, fileName?: string) {
    setUploading(true);
    setError(null);
    setDownloadURL(null);

    try {
      const name = fileName || `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `gym/${name}`);
      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);
      setDownloadURL(url);
      return url;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao fazer upload");
      } else {
        setError("Erro ao fazer upload");
      }
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function getMediaURL(storagePath: string): Promise<string> {
    try {
      const fileRef = ref(storage, storagePath);
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (error) {
      console.error("Erro ao obter URL de download:", error);
      throw error;
    }
  }

  async function signUp(username: string, email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // adding the username to the account
      await updateProfile(userCredential.user, {
        displayName: username,
      });
    } catch (error) {
      const err = error as AuthError;

      if (err.code === "auth/email-already-in-use") {
        throw new Error("This email is already in use");
      } else if (err.code === "auth/invalid-email") {
        throw new Error("Invalid email address");
      } else if (err.code === "auth/weak-password") {
        throw new Error("Password is too weak");
      } else {
        throw new Error("Sorry, something went wrong. Try again later");
      }
    }
  }

  async function signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const err = error as AuthError;

      if (err.code === "auth/user-not-found") {
        throw new Error("User not found");
      } else if (err.code === "auth/invalid-credential") {
        throw new Error("Email or password is wrong");
      } else if (err.code === "auth/invalid-email") {
        throw new Error("Invalid email");
      } else {
        throw new Error("Something went wrong!");
      }
    }
  }

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Something went wrong: ", error);
    }
  }

  async function getAuthenticatedUser(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }

  async function logOut() {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      throw new Error("Something went wrong while signing out");
    }
  }

  async function deleteUser() {
    try {
      const user = auth.currentUser;
      await logOut();
      await user!.delete();
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Something went wrong while deleting the user");
    }
  }

  async function generateFaceRecognitionToken() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          resolve(null);
          throw new Error(
            "The token can't be generated because there is no authenticated user"
          );
        }
        try {
          const token = uuidv4();
          const expiresAt = Date.now() + 1000 * 60 * 60 * 24;
          await setDoc(doc(db, "faceRecognitionTokens", token), {
            userId: user.uid,
            createdAt: Date.now(),
            expiresAt,
          });
          resolve(token);
        } catch (error) {
          console.error("Error generating face recognition token:", error);
          reject(new Error("Something went wrong, try again later!"));
        }
      });
    });
  }

  async function verifyFaceRecognitionToken(token: string) {
    const tokenDoc = await getDoc(doc(db, "faceRecognitionTokens", token));
    if (!tokenDoc.exists()) return new Error("Invalid or expired token");

    const { userId, expiresAt } = tokenDoc.data();
    if (Date.now() > expiresAt) {
      await deleteDoc(doc(db, "clockInTokens", token));
      return new Error("Token expired");
    }

    return userId;
  }

  function getAllEmployees(): Promise<EmployeeWithId[] | null> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const q = query(
              collection(db, "employees"),
              where("createdBy", "==", user.uid)
            );
            const querySnapshot = await getDocs(q);
            const employees = querySnapshot.docs.map((doc) => {
              const data = doc.data() as Omit<EmployeeWithId, "id">;
              return {
                id: doc.id,
                ...data,
              } as EmployeeWithId;
            });
            resolve(employees);
          } catch (error) {
            console.error("Error getting employees:", error);
            reject(new Error("Something went wrong, try again later!"));
          }
        } else {
          resolve(null);
        }
      });
    });
  }

  async function getAllEmployeesTimeRecords(): Promise<
    (EmployeeTimeRecordWithId & Employee)[] | null
  > {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const employees = await getAllEmployees();
            if (!employees) return resolve([]);

            const allRecords = await Promise.all(
              employees.map(async (employee) => {
                const { id, ...employeeWithoutId } = employee;
                const q = query(
                  collection(db, "employeesTimeRecords"),
                  where("employeeId", "==", id)
                );
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map((doc) => {
                  const data = doc.data() as Omit<
                    EmployeeTimeRecordFromFirebase,
                    "id"
                  >;
                  return {
                    id: doc.id,
                    ...data,
                    ...employeeWithoutId,
                    clockedIn: data.clockedIn.toDate(),
                    clockedOut: data.clockedOut?.toDate(),
                    day: data.day.toDate(),
                  } as EmployeeTimeRecordWithId & Employee;
                });
              })
            );

            // Flatten o array de arrays
            resolve(allRecords.flat());
          } catch (error) {
            console.error("Error getting employees:", error);
            reject(new Error("Something went wrong, try again later!"));
          }
        } else {
          resolve(null);
        }
      });
    });
  }

  async function addEmployee(values: Employee): Promise<string> {
    try {
      const existingEmployee = await getEmployeeByEmail(values.email);
      if (existingEmployee) {
        throw new Error("Email already in use");
      }
      const docRef = await addDoc(collection(db, "employees"), {
        ...values,
        createdBy: auth.currentUser!.uid,
      });
      return docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
      throw new Error("Something went wrong, try again later!");
    }
  }

  async function addEmployeeTimeRecord(values: EmployeeTimeRecord) {
    try {
      await addDoc(collection(db, "employeesTimeRecords"), values);
    } catch (e) {
      console.error("Error adding document: ", e);
      throw new Error("Something went wrong, try again later!");
    }
  }

  async function deleteEmployee(employeeId: string) {
    try {
      const employeeRef = doc(db, "employees", employeeId);
      await deleteDoc(employeeRef);
    } catch (e) {
      console.error("Error deleting document: ", e);
      throw new Error("Something went wrong, try again later!");
    }
  }

  async function updateEmployee(values: Employee, employeeId: string) {
    try {
      const employeeRef = doc(db, "employees", employeeId);
      await updateDoc(employeeRef, values);
    } catch (e) {
      console.error("Error deleting document: ", e);
      throw new Error("Something went wrong, try again later!");
    }
  }

  async function updateEmployeeTimeRecord(employeeTimeRecordId: string) {
    try {
      const employeeTimeRecordRef = doc(
        db,
        "employeesTimeRecords",
        employeeTimeRecordId
      );
      await updateDoc(employeeTimeRecordRef, { clockedOut: new Date() });
    } catch (e) {
      console.error("Error deleting document: ", e);
      throw new Error("Something went wrong, try again later!");
    }
  }

  async function getEmployeeByEmail(email: string) {
    const employeesRef = collection(db, "employees");
    const q = query(employeesRef, where("email", "==", email));
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const docSnapshot = querySnapshot.docs[0];
      const employeeData = docSnapshot.data() as Employee;
      return employeeData;
    } catch (e) {
      console.error("Error getting document: ", e);
      throw new Error("Something went wrong, try again later!");
    }
  }

  async function getPendingEmployeeTimeRecord(employeeId: string) {
    const employeesTimeRecordsRef = collection(db, "employeesTimeRecords");
    const q = query(
      employeesTimeRecordsRef,
      where("employeeId", "==", employeeId),
      where("clockedOut", "==", null)
    );
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const docSnapshot = querySnapshot.docs[0];
      const employeeTimeRecord = docSnapshot.data() as EmployeeTimeRecordWithId;
      return { ...employeeTimeRecord, id: docSnapshot.id };
    } catch (e) {
      console.error("Error getting document: ", e);
      throw new Error("Something went wrong, try again later!");
    }
  }

  async function getEmployeesByUserId(id: string) {
    try {
      const q = query(
        collection(db, "employees"),
        where("createdBy", "==", id)
      );
      const querySnapshot = await getDocs(q);
      const employees = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<EmployeeWithId, "id">;
        return {
          id: doc.id,
          ...data,
        } as EmployeeWithId;
      });
      return employees;
    } catch (error) {
      console.error("Error getting employees: ", error);
      throw new Error("Something went wrong, try again later!");
    }
  }

  return {
    uploadImage,
    getMediaURL,
    signUp,
    signIn,
    signInWithGoogle,
    getAuthenticatedUser,
    logOut,
    deleteUser,
    generateFaceRecognitionToken,
    verifyFaceRecognitionToken,
    getEmployeesByUserId,
    getAllEmployees,
    getAllEmployeesTimeRecords,
    getPendingEmployeeTimeRecord,
    addEmployee,
    addEmployeeTimeRecord,
    deleteEmployee,
    updateEmployee,
    updateEmployeeTimeRecord,
    uploading,
    error,
    downloadURL,
  };
};
