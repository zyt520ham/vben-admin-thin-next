<template>
  <BasicModal
    :destroy-on-close="true"
    :class="`${prefixCls}`"
    centered
    v-bind="$attrs"
    width="400px"
    min-height="50"
    @register="register"
    title="重置密码"
    @ok="okBtnEventFn"
  >
    <template #default>
      <div :class="`${prefixCls}-inner-class`">
        <span> 将修改用户【{{ nickNameComputed }}】的登录密码</span>
        <a-input
          :class="`${prefixCls}-input custom-input`"
          placeholder="请输入重置密码"
          v-model:value="inputModel"
        />
      </div>
    </template>
  </BasicModal>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { log, logNoTrace } from '/@/utils/log';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { resetUserPsdByAdminApi } from '/@/api/sys/user';
  import { IReqUserPsdResetByAdmin } from '/@/api/model/userModel';
  import { IUserInfo } from '/#/store';
  import { IReqErr } from '/#/axios';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'UserResetPsdModal',
    components: {
      BasicModal,
    },
    setup() {
      const { prefixCls } = useDesign('proj-user-resetpsd');
      const inputModel = ref<string>('');
      const modifyUserInfo = ref<IUserInfo>({} as any);
      const [register, modalMethods] = useModalInner((data) => {
        logNoTrace('reset psd user:', data.nickname);
        modifyUserInfo.value = data;
        modalMethods.setModalProps({
          height: 100,
        });
      });
      // setModalProps({
      //   height: 250,
      // });
      const nickNameComputed = computed(() => {
        return modifyUserInfo.value.nickname;
      });
      const okBtnEventFn = () => {
        modalMethods.setModalProps({ loading: true });
        const params: IReqUserPsdResetByAdmin = {
          new_password: inputModel.value,
          user_id: modifyUserInfo.value.user_id,
        };
        resetUserPsdByAdminApi(params).then(
          (resp) => {
            log(resp);
            message.success('修改密码成功');
            modalMethods.setModalProps({ loading: false });
            modalMethods.closeModal();
          },
          (err: IReqErr) => {
            message.error(err.retMsg!);
            modalMethods.setModalProps({ loading: false });
          },
        );
      };
      return {
        register,
        prefixCls,
        inputModel,
        okBtnEventFn,
        nickNameComputed,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-proj-user-resetpsd';
  @ns-prefix: ~'@{namespace}';
  .@{prefix-cls} {
    &-inner-class {
      height: 100px;
    }
    &-input.custom-input {
      //top: 50%;
      margin-top: 20px;
    }
  }
</style>
