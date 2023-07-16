import { atom, selector } from "recoil";

export enum Categories {
  "TO_DO" = "TO_DO",
  "DOING" = "DOING",
  "DONE" = "DONE",
}
/* 
enum을 통해 "TO_DO라는 값을 0이라고 저장할 수 있다.(TO_DO라고 보이지만 컴퓨터상 0이라 저장되어있음)
ToDo.tsx에 button값에 name에는 숫자가 아닌 문자로 들어가야 하기 때문에 TO_DO=TO_DO라고 string값으로 변환해서 사용한 것
*/
export interface IToDo {
  text: string;
  id: number;
  category: Categories;
}

export const categoryState = atom<Categories>({
  key: "category",
  default: Categories.TO_DO,
});

export const toDoState = atom<IToDo[]>({
  key: "toDo",
  default: [],
});

export const toDoSelector = selector({
  key: "toDoSelector",
  get: ({ get }) => {
    const toDos = get(toDoState);
    const category = get(categoryState);
    return toDos.filter((toDo) => toDo.category === category);
  },
});
