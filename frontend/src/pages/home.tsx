import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

const ConvRooms = [
  { name: "Room 1", id: "asdf", members: 2 },
  { name: "Room 2", id: "zxcvsdaf", members: 3 },
  { name: "Room 3", id: "qwer", members: 4 },
  { name: "Room 3", id: "asdfe", members: 5 },
  { name: "Room 3", id: "1dfc", members: 6 },
];

export interface IConvInfo {
  name: string;
  id: string;
  owner: string;
  members: number;
}

export const Home = () => {
  const [title, setTitle] = useState("");
  const [nickname, setNickname] = useState("");

  const { token } = useJwtStore();
  const navigate = useNavigate();

  //TODO: add react query
  useEffect(() => {}, []);

  const createConv = async () => {
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

    // navigate to the newly created conversation
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
        {ConvRooms.map((conv) => (
          <Card key={conv.id}>
            <CardHeader>{conv.name}</CardHeader>
            <CardContent>{conv.members}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
