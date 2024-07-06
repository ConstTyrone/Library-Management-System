<template>
  <div class="scroll-container">
    <n-space vertical :size="12">
      
        <n-data-table
          :bordered="false"
          :single-line="false"
          :columns="columns"
          :data="data"
          :pagination="pagination"
          class="custom-table"
        />
      
    </n-space>
  </div>
</template>


<script>
  import { h, defineComponent } from "vue";
  import { NTag, NButton, useMessage } from "naive-ui";
  
  import ChildComponent from "./Test.vue";
  function performSearch() {

}
  const createColumns = ({
    sendMail
  }) => {
    return [
      {
        title: "书名",
        key: "name"
      },
      {
        title: "作者",
        key: "age"
      },
      {
        title: "数量",
        key: "num"
      },
      {
        title: "位置",
        key: "address"
      },
      {
        title: "操作",
        key: "actions",
        render(row) {
          return h(
            NButton,
            {
              size: "small",
              onClick: () => sendMail(row)
            },
            { default: () => "修改" }
          );
        }
      }
    ];
  };
  //数据库待传参
  const createData = () => [
    {
      key: 0,
      name: "茶馆",
      age: "老舍",
      num:10,
      address: "津南中心馆",
    },
    {
      key: 1,
      name: "老人与海",
      age: "海明威",
      num:6,
      address: "八里台逸夫馆",
    },
    {
      key: 2,
      name: "生活是很好玩的",
      age: "汪曾祺",
      num:5,
      address: "津南中心馆",
    },
    {
      key: 0,
      name: "茶馆",
      age: "老舍",
      num:10,
      address: "津南中心馆",
    },
    {
      key: 1,
      name: "老人与海",
      age: "海明威",
      num:6,
      address: "八里台逸夫馆",
    },
    {
      key: 2,
      name: "生活是很好玩的",
      age: "汪曾祺",
      num:5,
      address: "津南中心馆",
    }
  ];
  
  export default defineComponent({
    components: {
    ChildComponent,
  },
    setup() {
      const message = useMessage();
      return {
        data: createData(),
        columns: createColumns({
          sendMail(rowData) {
            message.info("send mail to " + rowData.name);
          }
        }),
        pagination: {
          pageSize: 5
        }
      };

    }
  });

 

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
