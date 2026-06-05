import AppShell from './layout/AppShell';



export default function AppLayout({ children, fullBleed = false }) {

 return <AppShell fullBleed={fullBleed}>{children}</AppShell>;

}

