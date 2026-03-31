const video = document.getElementById('video');
const canvas = document.createElement('canvas');
const captureBtn = document.getElementById('capture');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('imageInput');
const output = document.getElementById('output');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream; })
    .catch(err => { console.error(err); });

async function analyze(blob) {
      output.innerText = 'Analyzing...';
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');
      try {
                const res = await fetch('/analyze', { method: 'POST', body: formData });
                const data = await res.json();
                output.innerText = data.analysis || data.error || 'Done';
      } catch (e) {
                output.innerText = 'Error analyzing image.';
      }
}

captureBtn.addEventListener('click', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob(analyze, 'image/jpeg');
});

uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) analyze(fileInput.files[0]);
});
