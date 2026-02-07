import Register from "@/components/Register";
import {render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock Server Action
vi.mock("@/app/actions/user", () => ({
  registerUser: vi.fn(),
}));

describe("Register Component", () => {
  it("deve renderizar todos os campos do formulário", () => {
    render(<Register />);

    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /criar conta/i})).toBeInTheDocument();
  });

  it("deve renderizar link para login", () => {
    render(<Register />);

    const loginLink = screen.getByRole("link", {name: /fazer login/i});
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/");
  });

  it("deve renderizar título e descrição corretos", () => {
    render(<Register />);

    expect(screen.getByText(/criar conta/i)).toBeInTheDocument();
    expect(screen.getByText(/preencha os dados para se cadastrar/i)).toBeInTheDocument();
  });

  it("deve ter placeholders corretos nos campos", () => {
    render(<Register />);

    expect(screen.getByPlaceholderText(/seu nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seu@email.com/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/••••••••/i)).toHaveLength(2);
  });
});
