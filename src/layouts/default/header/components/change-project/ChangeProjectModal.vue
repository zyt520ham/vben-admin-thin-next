<template>
  <BasicModal
    destroyOnClose
    :title="t('layout.header.changeProject')"
    v-bind="$attrs"
    :class="prefixCls"
    @register="register"
    @visible-change="handleShowFn"
    @ok="okBtnEventFn"
  >
    <template #default>
      <h3 class="text-center py-5px">当前登录项目 {{ currentProjsNameComputed }}</h3>
      <a-radio-group v-model:value="selectedProjId">
        <template v-for="proj in getProjsListComputed" :key="proj.project_id">
          <a-radio :style="radioStyle" :value="proj.project_id">{{ proj.project_name }}</a-radio>
        </template>
      </a-radio-group>
    </template>
  </BasicModal>
</template>

<script lang="ts">
  import { computed, defineComponent, reactive, ref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useProjsStoreWithOut } from '/@/store/modules/projectsStore';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { IProjectInfo } from '/#/store';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'ChangeProjectModal',
    components: { BasicModal },
    setup() {
      const { t } = useI18n();
      const { prefixCls } = useDesign('header-change-project-modal');
      const [register, { closeModal, setModalProps }] = useModalInner();

      const currentProjsNameComputed = computed(() => {
        const allProjsMap = useProjsStoreWithOut().getAllProjectsMap;
        const proj: IProjectInfo = allProjsMap[useUserStoreWithOut().getLoginInfo?.project || ''];
        if (proj) {
          return proj.project_name;
        }
        return '';
      });
      const getProjsListComputed = computed(() => {
        return useProjsStoreWithOut().getMyProjects.slice();
      });
      const radioStyle = reactive({
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        'padding-left': '50px',
      });
      const router = useRouter();
      const selectedProjId = ref<string>(useUserStoreWithOut().getLoginInfo?.project || '');
      watch(
        () => selectedProjId.value,
        () => {
          checkSubmitStateFn();
        },
        {
          immediate: false,
        },
      );

      const checkSubmitStateFn = () => {
        if (selectedProjId.value !== useUserStoreWithOut().getLoginInfo?.project) {
          setModalProps({
            okButtonProps: {
              disabled: false,
            },
          });
        } else {
          setModalProps({
            okButtonProps: {
              disabled: true,
            },
          });
        }
      };
      const handleShowFn = (visible: boolean) => {
        if (visible) {
          //组件显示
          checkSubmitStateFn();
        }
      };
      const okBtnEventFn = async () => {
        setModalProps({ loading: true, confirmLoading: true });
        await useUserStoreWithOut().doChangeProject(selectedProjId.value);
        setModalProps({ loading: false, confirmLoading: false });
        await router.replace(PageEnum.BASE_HOME);
        closeModal();
      };
      return {
        prefixCls,
        t,
        register,
        currentProjsNameComputed,
        selectedProjId,
        radioStyle,
        handleShowFn,
        getProjsListComputed,
        okBtnEventFn,
      };
    },
  });
</script>

<style scoped></style>
