import http.server
import socket

PORTA = 8000

def ip_local():
    """Descobre o IP deste computador dentro do Wi-Fi."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80)) # não envia nada de verdade
    ip = s.getsockname()[0]   # só pergunta "qual IP eu usaria?"
    s.close()
    return ip

class Handler(http.server.SimpleHTTPRequestHandler):
    # Tipos de arquivo que o Windows às vezes informa errado.
    # O sw.js (app instalável) não funciona se o .js vier como texto comum.
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".webmanifest": "application/manifest+json",
    }

    def end_headers(self):
        # Impede o navegador de guardar versões antigas do CSS
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

class Servidor(http.server.ThreadingHTTPServer):
    allow_reuse_address = True   # permite reusar a porta logo após parar
    daemon_threads = True        # as threads morrem junto com o programa


with Servidor(("", PORTA), Handler) as servidor:
    print(f"Computador: http://localhost:{PORTA}")
    print(f"Celular:    http://{ip_local()}:{PORTA}")
    print("Ctrl + C para parar")
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.")
