<template>
  <div class="w-full h-full">
    <div class="change-avatar">
      <CropperAvatar
        :uploadApi="copperApiFn"
        :value="avatar"
        btnText="更换头像"
        :showBtn="false"
        :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
        @change="updateAvatarFn"
        width="150"
      />
    </div>
    <ul class="list-group list-group-striped">
      <li class="list-group-item">
        <Icon :size="13" class="mr-5px" icon="userinfo|svg" />用户账号
        <span class="pull-right">{{ user.account }}</span>
      </li>
      <li class="list-group-item">
        <Icon :size="13" class="mr-5px" icon="userinfo|svg" />用户昵称
        <span class="pull-right">{{ user.nickname }}</span>
      </li>
      <li class="list-group-item">
        <Icon :size="13" class="mr-5px" icon="userinfo|svg" />手机号码
        <span class="pull-right">{{ user.phone }}</span>
      </li>
      <li class="list-group-item">
        <Icon :size="13" class="mr-5px" icon="userinfo|svg" />用户邮箱
        <span class="pull-right">{{ user.email }}</span>
      </li>
      <li class="list-group-item">
        <Icon :size="13" class="mr-5px" icon="userinfo|svg" />所属角色
        <a-tooltip placement="top" class="relative">
          <template #title>
            <span>{{ getRoles }}</span>
          </template>
          <span class="pull-right">{{ getRoles }} </span>
        </a-tooltip>
      </li>
      <li class="list-group-item">
        <Icon :size="13" class="mr-5px" icon="userinfo|svg" />性别
        <span class="pull-right">{{ getSex }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { IUserInfo } from '/#/store';
  import { Icon } from '/@/components/Icon';
  import { CropperAvatar } from '/@/components/Cropper';
  import { log } from '/@/utils/log';
  import headerImg from '/@/assets/images/header.jpg';

  export default defineComponent({
    name: 'UserProfileInfoView',
    components: { Icon, CropperAvatar },
    setup() {
      const user = computed<Nullable<IUserInfo>>(() => {
        return useUserStoreWithOut().getUserInfoV1;
      });
      const getSex = computed(() => {
        if (user.value?.sex + '' === '0') {
          return '男';
        } else if (user.value?.sex + '' === '1') {
          return '女';
        }
        return '未知';
      });
      const getRoles = computed(() => {
        let roleStr = (user.value?.project_roles && user.value.project_roles.join(',')) || '';
        roleStr = roleStr;
        return roleStr;
      });
      const avatar = computed(() => {
        const { avatar } = user.value!;
        return avatar || headerImg;
      });

      function updateAvatarFn(src: any) {
        log('updateAvatarFn', src);
        useUserStoreWithOut().setUserAvatar(src);
        // const userinfo = userStore.getUserInfo;
        // userinfo.avatar = src;
        // userStore.setUserInfo(userinfo);
      }

      const copperApiFn = (params: { file: Blob; name: string; filename: string }) => {
        return new Promise<any>((resolve) => {
          //本地预览  模拟上传逻辑
          const reader = new FileReader();
          reader.readAsDataURL(params.file);
          reader.onload = () => {
            const url = (reader.result as string) || '';
            resolve({ data: url });
          };
        });
      };
      return {
        user,
        getSex,
        getRoles,
        avatar,
        updateAvatarFn,
        copperApiFn,
      };
    },
  });
</script>

<style scoped lang="less">
  .change-avatar {
    text-align: center;
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }
  .list-group-striped > .list-group-item {
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    padding-left: 0;
    padding-right: 0;
  }
  .list-group-item {
    border-bottom: 1px solid #e7eaec;
    //border-top: 1px solid #e7eaec;
    margin-bottom: -1px;
    padding: 11px 0px;
    font-size: 13px;
  }
  .list-group {
    padding-left: 0px;
    list-style: none;
  }
  .pull-right {
    float: right;
  }
  span.pull-right {
    //float: right;
    white-space: nowrap;
    width: 70%;
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
  }
  .text-center {
    text-align: center;
  }
</style>
