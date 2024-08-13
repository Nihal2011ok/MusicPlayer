const albumArt = document.getElementById('album-art');
const songTitle = document.getElementById('song-title');
const artist = document.getElementById('artist');
const shuffleBtn = document.getElementById('shuffle-btn');
const prevBtn = document.getElementById('prev-btn');
const playBtn = document.getElementById('play-btn');
const nextBtn = document.getElementById('next-btn');
const repeatBtn = document.getElementById('repeat-btn');
const progressBar = document.querySelector('.progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const playlistItems = document.getElementById('playlist-items');
const lyricsContent = document.getElementById('lyrics-content');
const visualizer = document.getElementById('visualizer');
const darkModeToggle = document.getElementById('dark-mode-toggle');

const audioPlayer = new Audio();
let isPlaying = false;
let currentSongIndex = 0;
let isShuffled = false;
let isRepeating = false;

const playlist = [
    { title: 'Song 1', artist: 'Artist 1', file: 'songs/song1.mp3', albumArt: 'images/album1.jpg', lyrics: 'Lyrics for Song 1...' },
    { title: 'Song 2', artist: 'Artist 2', file: 'songs/song2.mp3', albumArt: 'images/album2.jpg', lyrics: 'Lyrics for Song 2...' },
    { title: 'Song 3', artist: 'Artist 3', file: 'songs/song3.mp3', albumArt: 'images/album3.jpg', lyrics: 'Lyrics for Song 3...' },
];

function loadSong(index) {
    const song = playlist[index];
    audioPlayer.src = song.file;
    albumArt.src = song.albumArt;
    songTitle.textContent = song.title;
    artist.textContent = song.artist;
    lyricsContent.textContent = song.lyrics;
    updatePlaylistHighlight();
}

function updatePlaylistHighlight() {
    const items = playlistItems.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }
    items[currentSongIndex].classList.add('active');
}

function playSong() {
    audioPlayer.play();
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = playlist.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= playlist.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active');
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatBtn.classList.toggle('active');
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

playBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);

audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', () => {
    if (isRepeating) {
        loadSong(currentSongIndex);
        playSong();
    } else if (isShuffled) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === currentSongIndex);
        currentSongIndex = newIndex;
        loadSong(currentSongIndex);
        playSong();
    } else {
        nextSong();
    }
});

document.querySelector('.progress-bar').addEventListener('click', setProgress);

volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value / 100;
});

// Populate playlist
playlist.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener('click', () => {
        currentSongIndex = index;
        loadSong(currentSongIndex);
        playSong();
    });
    playlistItems.appendChild(li);
});

// Tabs functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Visualizer
const ctx = visualizer.getContext('2d');
let audioContext, analyser, source, dataArray;

function setupVisualizer() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
}

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, visualizer.width, visualizer.height);
    const barWidth = (visualizer.width / dataArray.length) * 2.5;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        ctx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
              x += barWidth + 1;
    }
}

// Initialize Visualizer
setupVisualizer();
drawVisualizer();

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.classList.toggle('active');
});

// Initial Load
loadSong(currentSongIndex);
audioPlayer.volume = volumeSlider.value / 100;

     