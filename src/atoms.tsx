import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "recoil-persist", // 고유한 키 값을 지정합니다.
  storage: localStorage, // 사용할 스토리지 종류를 선택합니다 (localStorage, sessionStorage 등).
});

export enum Categories {
  "TO_DO" = "TO_DO",
  "DOING" = "DOING",
  "DONE" = "DONE",
}

export interface IToDo {
  text: string;
  category: Categories;
  id: number;
}

export const categoryState = atom({
  key: "category",
  default: Categories.TO_DO,
});

export const toDoState = atom<IToDo[]>({
  key: "todo",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const toDoSelect = selector({
  key: "toDoSelect",
  get: ({ get }) => {
    const toDos = get(toDoState);
    const category = get(categoryState);
    return toDos.filter((toDo) => toDo.category === category);
  },
});
