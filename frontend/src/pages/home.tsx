import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ISocketCreateConvRequest } from "@/types/socket";

export interface IConvInfo {
  name: string;
  id: string;
  owner: string;
}

export const Home = () => {
  const [inputTitle, setInputTitle] = useState("");
  const [convs, setConvs] = useState<Array<IConvInfo>>([]);
  const { socket } = useSocketStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConvs = async () => {
      const res = await fetch("http://localhost:3008/conv");
      const convs = (await res.json()) as Array<IConvInfo>;
      setConvs(convs);
    };

    fetchConvs();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("created_conv", (data) => {
        toast.success(`${data} created`);
      });

      socket.on("deleted_conv", (data) => {
        toast.error(`conv ${data} deleted`);
      });
    }

    return () => {
      if (socket) {
        socket.off("created_conv");
        socket.off("deleted_conv");
      }
    };
  }, [socket]);

  const createConv = async () => {
    if (!socket) {
      console.log("socket not connected");
      return;
    }

    socket.emit(
      "create_conv",
      {
        title: inputTitle,
      } satisfies ISocketCreateConvRequest,
      (convId: string) => {
        navigate(`/chat/${convId}`);
      }
    );
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
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
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
              <Button onClick={() => joinConv(conv.id)}>Join</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
