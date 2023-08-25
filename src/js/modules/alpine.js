import Alpine from 'alpinejs';

window.Alpine = Alpine;

document.addEventListener('alpine:init', () => {
    Alpine.data('hello', () => ({
        text: 'Hello, Alpine!'
    }));
});

Alpine.start();