import { ref } from "vue";

const sidebarAberto = ref(false);

const toggleSidebar = () => {
  sidebarAberto.value = !sidebarAberto.value;
};

const fecharSidebar = () => {
  sidebarAberto.value = false;
};

const abrirSidebar = () => {
  sidebarAberto.value = true;
};

export const useSidebar = () => {
  return {
    sidebarAberto,
    toggleSidebar,
    fecharSidebar,
    abrirSidebar,
  };
};
