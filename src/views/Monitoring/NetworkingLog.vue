<template>
    <div>
        <LogTable :headers="headers" :items="plugItems" :isQuest="false" />
    </div>
</template>

<script>
import equiptableMixin from '@/mixins/plugItems.mixin';

export default {
    mixins: [equiptableMixin],
};
</script>
