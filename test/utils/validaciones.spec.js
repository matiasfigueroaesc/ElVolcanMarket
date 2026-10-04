import {
  esRunValido,
  esCorreoPermitido,
  validarNombre,
  validarApellidos,
  validarCorreo,
  validarPassword,
  validarConfirmacionPassword,
  validarTelefono,
  validarRun,
  validarFechaNacimiento,
  validarSeleccion,
  validarTextoObligatorio,
} from "../../src/utils/validaciones.js";

describe("utils/validaciones.js", () => {
  // --- nombre / apellidos ---------------------------------------------

  describe("validarNombre", () => {
    it("rechaza vacío o solo espacios", () => {
      expect(validarNombre("")).toBe("El nombre es obligatorio");
      expect(validarNombre("   ")).toBe("El nombre es obligatorio");
    });

    it("acepta un nombre con contenido", () => {
      expect(validarNombre("Camila")).toBe("");
    });
  });

  describe("validarApellidos", () => {
    it("rechaza vacío", () => {
      expect(validarApellidos("")).toBe("Los apellidos son obligatorios.");
    });

    it("acepta apellidos con contenido", () => {
      expect(validarApellidos("Toro Salinas")).toBe("");
    });
  });

  // --- correo ------------------------------------------------------------

  describe("esCorreoPermitido", () => {
    it("acepta dominios institucionales y gmail", () => {
      expect(esCorreoPermitido("camila.toro@gmail.com")).toBeTrue();
      expect(esCorreoPermitido("pedro.salinas@duoc.cl")).toBeTrue();
      expect(esCorreoPermitido("profe@profesor.duoc.cl")).toBeTrue();
    });

    it("rechaza otros dominios", () => {
      expect(esCorreoPermitido("alguien@hotmail.com")).toBeFalse();
      expect(esCorreoPermitido("sin-arroba")).toBeFalse();
    });
  });

  describe("validarCorreo", () => {
    it("es obligatorio por defecto", () => {
      expect(validarCorreo("")).toBe("El correo es obligatorio.");
    });

    it("permite vacío cuando requerido es false", () => {
      expect(validarCorreo("", { requerido: false })).toBe("");
    });

    it("rechaza un dominio no permitido", () => {
      expect(validarCorreo("ana@hotmail.com")).toContain("dominio válido");
    });

    it("acepta un correo válido", () => {
      expect(validarCorreo("camila.toro@gmail.com")).toBe("");
    });

    it("rechaza un correo con formato inválido aunque no se restrinja el dominio", () => {
      expect(validarCorreo("sin-arroba")).toBe("Ingresa un correo válido.");
      expect(validarCorreo("ana@hotmail", { restringirDominio: false })).toBe("Ingresa un correo válido.");
    });

    it("con restringirDominio false acepta cualquier dominio con formato válido", () => {
      expect(validarCorreo("ana@correo.cl", { restringirDominio: false })).toBe("");
    });

    it("con restringirDominio false sigue exigiendo el correo", () => {
      expect(validarCorreo("", { restringirDominio: false })).toBe("El correo es obligatorio.");
    });

    it("por defecto mantiene la restricción de dominio", () => {
      expect(validarCorreo("ana@correo.cl")).toContain("dominio válido");
    });
  });

  // --- password ------------------------------------------------------------

  describe("validarPassword", () => {
    it("es obligatoria por defecto", () => {
      expect(validarPassword("")).toBe("La contraseña es obligatoria.");
    });

    it("permite vacío cuando requerido es false (edición sin cambiar clave)", () => {
      expect(validarPassword("", { requerido: false })).toBe("");
    });

    it("rechaza largos fuera de 4-20 caracteres", () => {
      expect(validarPassword("abc")).toContain("entre 4 y 20");
      expect(validarPassword("a".repeat(21))).toContain("entre 4 y 20");
    });

    it("acepta una contraseña válida", () => {
      expect(validarPassword("admin1234")).toBe("");
    });
  });

  describe("validarConfirmacionPassword", () => {
    it("exige confirmar", () => {
      expect(validarConfirmacionPassword("", "admin1234")).toBe("Debes confirmar la contraseña.");
    });

    it("rechaza si no coincide", () => {
      expect(validarConfirmacionPassword("otra123", "admin1234")).toBe("Las contraseñas no coinciden.");
    });

    it("acepta si coincide", () => {
      expect(validarConfirmacionPassword("admin1234", "admin1234")).toBe("");
    });
  });

  // --- teléfono ------------------------------------------------------------

  describe("validarTelefono", () => {
    it("es opcional por defecto", () => {
      expect(validarTelefono("")).toBe("");
    });

    it("rechaza si es obligatorio y viene vacío", () => {
      expect(validarTelefono("", { requerido: true })).toBe("El teléfono es obligatorio.");
    });

    it("rechaza formatos inválidos", () => {
      expect(validarTelefono("123")).toContain("teléfono válido");
      expect(validarTelefono("91234567a")).toContain("teléfono válido");
    });

    it("acepta 8 o 9 dígitos", () => {
      expect(validarTelefono("91234567")).toBe("");
      expect(validarTelefono("912345678")).toBe("");
    });
  });

  // --- RUN ------------------------------------------------------------

  describe("esRunValido", () => {
    it("valida un RUN correcto (con y sin formato)", () => {
      expect(esRunValido("11111111-1")).toBeTrue();
      expect(esRunValido("11.111.111-1")).toBeTrue();
    });

    it("rechaza un dígito verificador incorrecto", () => {
      expect(esRunValido("11111111-9")).toBeFalse();
    });

    it("rechaza formatos claramente inválidos", () => {
      expect(esRunValido("abc")).toBeFalse();
      expect(esRunValido("")).toBeFalse();
    });
  });

  describe("validarRun", () => {
    it("es obligatorio", () => {
      expect(validarRun("")).toBe("El RUN es obligatorio.");
    });

    it("rechaza un RUN inválido", () => {
      expect(validarRun("11111111-9")).toBe("El RUN ingresado no es válido.");
    });

    it("acepta un RUN válido", () => {
      expect(validarRun("11111111-1")).toBe("");
    });
  });

  // --- fecha de nacimiento ---------------------------------------------

  describe("validarFechaNacimiento", () => {
    it("es opcional", () => {
      expect(validarFechaNacimiento("")).toBe("");
    });

    it("rechaza una fecha futura", () => {
      const futura = new Date();
      futura.setFullYear(futura.getFullYear() + 1);
      const iso = futura.toISOString().slice(0, 10);
      expect(validarFechaNacimiento(iso)).toContain("no puede ser futura");
    });

    it("acepta una fecha pasada", () => {
      expect(validarFechaNacimiento("1998-05-20")).toBe("");
    });
  });

  // --- helpers genéricos ---------------------------------------------

  describe("validarSeleccion", () => {
    it("rechaza vacío con el mensaje por defecto", () => {
      expect(validarSeleccion("")).toBe("Debes seleccionar una opción.");
    });

    it("permite un mensaje personalizado", () => {
      expect(validarSeleccion("", "Debes seleccionar una región.")).toBe("Debes seleccionar una región.");
    });

    it("acepta un valor seleccionado", () => {
      expect(validarSeleccion("nuble")).toBe("");
    });
  });

  describe("validarTextoObligatorio", () => {
    it("rechaza vacío", () => {
      expect(validarTextoObligatorio("", "La dirección es obligatoria.")).toBe("La dirección es obligatoria.");
    });

    it("respeta el largo mínimo", () => {
      expect(validarTextoObligatorio("ab", "Mínimo 3 caracteres.", 3)).toBe("Mínimo 3 caracteres.");
      expect(validarTextoObligatorio("abc", "Mínimo 3 caracteres.", 3)).toBe("");
    });
  });
});
