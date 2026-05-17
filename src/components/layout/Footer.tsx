export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex h-14 px-6 items-center justify-between text-sm text-muted-foreground">
        <span>
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-foreground">VJS Groups</span>. All
          rights reserved.
        </span>
        <span>
          Powered by <span className="font-medium text-foreground">Springreen</span>
        </span>
      </div>
    </footer>
  )
}
