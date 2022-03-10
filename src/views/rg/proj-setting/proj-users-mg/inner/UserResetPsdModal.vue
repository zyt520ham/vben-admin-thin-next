<template>
  <BasicModal
    destroyOnClose
    :class="prefixCls"
    centered
    v-bind="$attrs"
    width="400px"
    @register="register"
    title="重置密码"
    @ok="okBtnEventFn"
  >
    <template #default>
      <a-input
        :class="`${prefixCls}-input custom-input`"
        placeholder="请输入重置密码"
        v-model:value="inputModel"
      />
    </template>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { log } from '/@/utils/log';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { resetUserPsdByAdminApi } from '/@/api/sys/user';
  import { IReqUserPsdResetByAdmin } from '/@/api/sys/model/userModel';
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
      const [register, { closeModal, setModalProps }] = useModalInner((data) => {
        log('reset pad user:', data.nickname);
        modifyUserInfo.value = data;
      });
      const okBtnEventFn = () => {
        setModalProps({ loading: true });
        const params: IReqUserPsdResetByAdmin = {
          new_password: inputModel.value,
          user_id: modifyUserInfo.value.user_id,
        };
        resetUserPsdByAdminApi(params).then(
          (resp) => {
            log(resp);
            message.success('修改密码成功');
            setModalProps({ loading: false });
            closeModal();
          },
          (err: IReqErr) => {
            message.error(err.retMsg!);
            setModalProps({ loading: false });
          },
        );
      };
      return {
        register,
        prefixCls,
        inputModel,
        okBtnEventFn,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-proj-user-resetpsd';
  @ns-prefix: ~'@{namespace}';
  .@{prefix-cls} {
    &-input.custom-input {
      //top: 50%;
      margin-top: 100px;
    }
  }
</style>
