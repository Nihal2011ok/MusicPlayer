const albumArt = document.getElementById('album-art');
const songTitle = document.getElementById('song-title');
const artist = document.getElementById('artist');
const prevBtn = document.getElementById('prev-btn');
const playBtn = document.getElementById('play-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.querySelector('.progress');

const audioPlayer = new Audio();
let isPlaying = false;
let currentSongIndex = 0;

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
}

function playSong() {
    audioPlayer.play();
    isPlaying = true;
    playBtn.textContent = 'Pause';
}

function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    playBtn.textContent = 'Play';
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

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
});

audioPlayer.addEventListener('ended', nextSong);

// Load the first song
loadSong(currentSongIndex);