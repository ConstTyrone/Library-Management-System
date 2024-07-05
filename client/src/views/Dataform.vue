<template>
  <div class="scroll-container">
    <n-space vertical :size="12">
      <div class="scroll-container">
        <n-data-table
          :bordered="false"
          :single-line="false"
          :columns="columns"
          :data="data"
          :pagination="pagination"
          class="custom-table"
        />
      </div>
    </n-space>
  </div>
</template>
<script setup>



</script>
<style>
.scroll-container {
  max-height: 400px; /* 根据需要设置高度 */
  overflow: auto;
  position: relative;
  width: 60%;
  left: 20%;
  margin: 0 auto; /* 居中显示 */
}
</style>
