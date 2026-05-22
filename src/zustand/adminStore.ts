import { AdminUser } from "@/generated/prisma/client";
import { create } from "zustand";

type AdminUserState = {
  adminUsers: AdminUser[];

  setAdminUsers: (value: AdminUser[]) => void;
  addAdminUser: (value: AdminUser) => void;

  updateAdminUser: (value: AdminUser) => void;
  removeAdminUser: (id: string) => void;

  resetAdminUsers: () => void;
};

export const useAdminUserStore = create<AdminUserState>((set) => ({
  adminUsers: [],

  setAdminUsers: (adminUsers) =>
    set({
      adminUsers,
    }),
  addAdminUser: (newAdminUser) =>
    set((state) => ({
      adminUsers: [newAdminUser, ...state.adminUsers],
    })),

  updateAdminUser: (updatedAdminUser) =>
    set((state) => {
      const exists = state.adminUsers.some(
        (adminUser) => adminUser.id === updatedAdminUser.id,
      );

      if (exists) {
        return {
          adminUsers: state.adminUsers.map((adminUser) =>
            adminUser.id === updatedAdminUser.id ? updatedAdminUser : adminUser,
          ),
        };
      }

      return {
        adminUsers: [updatedAdminUser, ...state.adminUsers],
      };
    }),

  removeAdminUser: (id) =>
    set((state) => ({
      adminUsers: state.adminUsers.filter((adminUser) => adminUser.id !== id),
    })),

  resetAdminUsers: () =>
    set({
      adminUsers: [],
    }),
}));
