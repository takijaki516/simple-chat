import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useJwtStore } from "@/store/jwt";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSocketStore } from "@/store/socket";

export interface IConvInfo {
  name: string;
  id: string;
  owner: string;
  members: number;
}

export const Home = () => {
  const [title, setTitle] = useState("");
  const [nickname, setNickname] = useState("");
  const [convs, setConvs] = useState<Array<IConvInfo>>([]);
  const { socket } = useSocketStore();

  const { token } = useJwtStore();
  const navigate = useNavigate();

  //TODO: add react query
  useEffect(() => {
    const fetchConvs = async () => {
      const res = await fetch("http://localhost:3008/conv");
      const convs = (await res.json()) as Array<IConvInfo>;
      setConvs(convs);
    };

    fetchConvs();
  }, []);

  const createConv = async () => {
    // TODO
    if (!socket) {
      console.log("socket not connected");
      return;
    }

    const payload = {
      title,
    };

    const res = await fetch("http://localhost:3008/conv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const { convId } = await res.json();

    // TODO:
    // socket.emit("create_room", convId);

    // navigate to the newly created conversation
    navigate(`/chat/${convId}`);
  };

  const joinConv = (convId: string) => {
    navigate(`/chat/${convId}`);
  };

  return (
    <div className="bg-background text-4xl flex flex-col">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="self-end mb-4">Create Conversation</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Create Conversations</DialogHeader>

          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="your conversation title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Label htmlFor="nickname">Nickname</Label>
          <Input
            id="nickname"
            placeholder="your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={createConv}>
                SUBMIT
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-2 gap-10">
        {convs.map((conv) => (
          <Card key={conv.id}>
            <CardHeader>
              <CardTitle>{conv.name}</CardTitle>
              <CardDescription>owner: {conv.owner}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="text-lg">active members: {conv.members}명</div>
              <Button onClick={() => joinConv(conv.id)}>Join</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
