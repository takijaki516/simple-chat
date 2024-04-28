import { useParams } from "react-router-dom";

export const Chat = () => {
  const params = useParams();
  console.log(params);

  return <div>CHatPage</div>;
};
