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

const audioPlayer = new Audio();
let isPlaying = false;
let currentSongIndex = 0;
let isShuffled = false;
let isRepeating = false;

const playlist = [
    { title: 'Song 1', artist: 'Artist 1', file: 'songs/song1.mp3', albumArt: 'images/album1.jpg' },
    { title: 'Song 2', artist: 'Artist 2', file: 'songs/song2.mp3', albumArt: 'images/album2.jpg' },
    { title: 'Song 3', artist: 'Artist 3', file: 'songs/song3.mp3', albumArt: 'images/album3.jpg' },
];

function loadSong(index) {
    const song = playlist[index];
    audioPlayer.src = song.file;
    albumArt.src = song.albumArt;
    songTitle.textContent = song.title;
    artist.textContent = song.artist;
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


loadSong(currentSongIndex);