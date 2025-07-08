import NavBar from "../components/NavBar"

export default function DefaultLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 left-0 right-0 z-50">
        <NavBar />
      </header>
      <main className="flex-grow pt-16">
        {children}
      </main>
    </div>
  )
}