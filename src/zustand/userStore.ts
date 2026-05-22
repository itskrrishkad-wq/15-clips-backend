import { User } from "@/generated/prisma/client";
import { create } from "zustand";

type UserState = {
  users: User[];

  setUsers: (value: User[]) => void;
  addUser: (value: User) => void;

  updateUser: (value: User) => void;
  removeUser: (id: string) => void;

  resetUsers: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  users: [],

  setUsers: (users) =>
    set({
      users,
    }),
  addUser: (newUser) =>
    set((state) => ({
      users: [newUser, ...state.users],
    })),
  updateUser: (updatedUser) =>
    set((state) => {
      const exists = state.users.some((user) => user.id === updatedUser.id);

      if (exists) {
        return {
          users: state.users.map((user) =>
            user.id === updatedUser.id ? updatedUser : user,
          ),
        };
      }

      return {
        users: [updatedUser, ...state.users],
      };
    }),

  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),

  resetUsers: () =>
    set({
      users: [],
    }),
}));
