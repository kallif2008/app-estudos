import { ref } from "vue";

const mostraLoading = ref(false);

const ativarLoading = () => {
  mostraLoading.value = true;
};

const desativarLoading = () => {
  console.log("oi");

  mostraLoading.value = false;
  console.log("aqui");
};

export const useLoading = () => {
  return {
    mostraLoading,
    ativarLoading,
    desativarLoading,
  };
};
