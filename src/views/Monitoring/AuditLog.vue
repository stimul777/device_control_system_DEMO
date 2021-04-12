<template>
    <div>
        <LogTable :headers="headers" :items="plugItems" :isQuest="false" />
    </div>
</template>

<script>
import equitableMixin from '@/mixins/plugItems.mixin';

export default {
    mixins: [equitableMixin],
};
</script>
