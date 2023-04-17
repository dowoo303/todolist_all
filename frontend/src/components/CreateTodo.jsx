import axios from "axios";
import { useState } from "react";

const CreateTodo = ({ userId, setTodos, todos }) => {
  const [todo, setTodo] = useState("");

  // 투두생성
  const onSubmitCreateTodo = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/todo`,
        {
          // 인섬니아에서 todo와 userId를 보내는 것처럼 여기서도 보내야함
          todo, // todo는 input에서 받은 값을 보냄
          userId, // Login.jsx에서 받아온 user의 id를 보냄
        }
      );

      // 등록 후 자동 업데이트
      setTodos([response.data.todo, ...todos]); // 위에서 배열로 받아오기 때문에 [] 대괄호 필요, 기존 데이터 ...(스프레드)문법으로 추가
      setTodo("");
    } catch (error) {
      console.error(error);

      alert("투두 생성중 에러가 발생하였습니다.");
    }
  };

  return (
    <form className="flex mt-2" onSubmit={onSubmitCreateTodo}>
      <input
        className="grow border-2 border-pink-200 rounded-lg focus:outline-pink-400 px-2 py-1 text-lg"
        type="text"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <input
        className="ml-4 px-2 py-1 bg-pink-400 rounded-lg text-gray-50"
        type="submit"
        value="새 투두 생성"
      />
    </form>
  );
};

export default CreateTodo;
