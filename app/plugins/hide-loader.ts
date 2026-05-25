export default defineNuxtPlugin({
    name: 'global-loader',
    enforce: 'post',

    setup() {
        const loader = document.getElementById('global-loader')
        if (!loader) return

        // At this point all plugins have run (including your async auth plugin)
        loader.classList.add('hidden')
        loader.addEventListener('transitionend', () => loader.remove(), { once: true })
    }
})