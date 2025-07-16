export class Camera {
  private video: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  async run() {
    this.video.autoplay = true;
    this.video.height = 500;
    this.video.width = 500;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    this.video.srcObject = stream;
    await new Promise((resolve) => {
      this.video.onloadedmetadata = () => {
        this.video.play();
        resolve(true);
      };
    });

    return this.video;
  }
}
