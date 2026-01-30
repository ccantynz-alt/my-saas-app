import os, sys, traceback
print("CWD:", os.getcwd())
print("PYEXE:", sys.executable)
print("PYVER:", sys.version)
print("SYSPATH:")
for p in sys.path:
  print("  ", p)

try:
  import backend
  print("backend:", getattr(backend, "__file__", None))
except Exception:
  print("FAILED importing backend")
  traceback.print_exc()
  raise

try:
  import backend.app
  print("backend.app:", getattr(backend.app, "__file__", None))
except Exception:
  print("FAILED importing backend.app")
  traceback.print_exc()
  raise

try:
  import backend.app.main as m
  print("backend.app.main:", getattr(m, "__file__", None))
except Exception:
  print("FAILED importing backend.app.main")
  traceback.print_exc()
  raise
