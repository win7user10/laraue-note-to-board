export default defineNuxtPlugin((nuxtApp) => {
    // Register a simple directive
    nuxtApp.vueApp.directive('col-scroll', {
        mounted(el, binding) {
            el._colScrollHandler = () => {
                const { statusId, onLoad, hasMore } = el._colScrollBinding;
                if (!hasMore(statusId)) return;  // nothing left — stop immediately
                const threshold = 80;
                const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
                if (nearBottom) onLoad(statusId);
            };
            el._colScrollBinding = binding.value;
            el.addEventListener('scroll', el._colScrollHandler, { passive: true });
        },
        updated(el, binding) {
            el._colScrollBinding = binding.value;
        },
        beforeUnmount(el) {
            el.removeEventListener('scroll', el._colScrollHandler);
        }
    });
})