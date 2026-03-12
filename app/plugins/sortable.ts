import Sortable from 'sortablejs';

export default defineNuxtPlugin((nuxtApp) => {
    // Register a simple directive
    nuxtApp.vueApp.directive('sortable', {
        mounted(el, binding) {
            const { catId, statusId, onCardMoved } = binding.value;
            el._sortableInstance = Sortable.create(el, {
                group: 'cards',           // same group = drag between columns
                animation: 150,
                delay: 150,               // long-press duration before drag starts
                delayOnTouchOnly: true,   // delay only on touch; mouse starts immediately
                touchStartThreshold: 4,   // px finger must move to cancel tap & start drag
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                forceFallback: true,
                onAdd(evt) {
                    // Card was dragged FROM another column INTO this one
                    const cardId = evt.item.dataset.cardId;
                    onCardMoved(cardId, catId, statusId);
                    // Remove the DOM node SortableJS physically moved — Vue re-renders from state
                    evt.item.remove();
                }
            });
            el._sortableMeta = { catId, statusId, onCardMoved };
        },
        updated(el, binding) {
            // Keep metadata fresh when Vue re-renders (e.g. board switch)
            el._sortableMeta = binding.value;
            if (el._sortableInstance) {
                const { onCardMoved, catId, statusId } = binding.value;
                el._sortableInstance.option('onAdd', (evt: { item: { dataset: { cardId: any; }; remove: () => void; }; }) => {
                    const cardId = evt.item.dataset.cardId;
                    onCardMoved(cardId, catId, statusId);
                    evt.item.remove();
                });
            }
        },
        beforeUnmount(el) {
            if (el._sortableInstance) { el._sortableInstance.destroy(); el._sortableInstance = null; }
        }
    });
})