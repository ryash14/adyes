/**
 * @author: @dorianbaffier
 * @description: Smooth Drawer
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { Menu, Lightbulb, Rocket, Users, Network } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const drawerVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function SmoothDrawer({
  primaryButtonText = "Sign Up",
  secondaryButtonText = "Log In",
  onSecondaryAction
}) {
  const navigate = useNavigate();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="p-2 -mr-2 text-foreground hover:bg-secondary rounded-full transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-sm rounded-t-2xl p-6 shadow-xl bg-background border-t border-border">
        <motion.div
          animate="visible"
          className="mx-auto w-full space-y-6"
          initial="hidden"
          variants={drawerVariants}>
          
          <DrawerHeader className="px-0 pb-2 border-b border-border/50">
            <DrawerTitle className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground">
              Menu
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col gap-2 py-4">
            <DrawerClose asChild>
              <Link to="/discover?tab=ideas" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary font-medium transition-colors text-foreground">
                <Lightbulb size={20} className="text-muted-foreground" /> Ideas
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link to="/discover?tab=projects" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary font-medium transition-colors text-foreground">
                <Rocket size={20} className="text-muted-foreground" /> Projects
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link to="/discover?tab=mentors" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary font-medium transition-colors text-foreground">
                <Users size={20} className="text-muted-foreground" /> Mentors
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link to="/network" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary font-medium transition-colors text-foreground">
                <Network size={20} className="text-muted-foreground" /> Network
              </Link>
            </DrawerClose>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <DrawerClose asChild>
              <Button onClick={() => navigate(primaryButtonText === 'Dashboard' ? '/dashboard' : '/register')} className="w-full h-12 rounded-xl text-base font-bold bg-foreground text-background">
                {primaryButtonText}
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button onClick={onSecondaryAction} variant="outline" className="w-full h-12 rounded-xl text-base font-bold">
                {secondaryButtonText}
              </Button>
            </DrawerClose>
          </div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}
