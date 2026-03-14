import { useState } from "react";
import type { SyntheticEvent } from "react";
import { getCookie } from "../../../utils/cookies";
import { handleAxiosError } from "../../../api/client";
import { CONFIG } from "../../../constants";
import logo from '@/assets/img/logo.png';

interface Props {
  onLoggedIn: () => void;
}

const LoginForm = ({ onLoggedIn }: Props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    console.log(CONFIG.API_URL);

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const csrftoken = getCookie("csrftoken");
            const res = await fetch(CONFIG.API_URL + "/login/", {
                method: "POST",
                credentials: "include", // importante: cookie de sesión
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken ?? "",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.detail || `Error ${res.status}`);
            }

            onLoggedIn(); // avisamos al padre de que hay sesión
        } catch (err: unknown) {
            handleAxiosError(err, setError, 'Error iniciando sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="w-full h-screen md:h-[inherit] md:max-w-md bg-base-100 shadow-xl md:rounded-lg p-8 flex flex-col gap-4">
            <img src={logo} alt="Logo - Mi Cine" className="" />
            <h1 className="m-0! pt-8 text-3xl mb-6 text-center">Iniciar sesión</h1>
            <form className="m-0! space-y-4 max-w-sm mx-auto" onSubmit={handleSubmit}>
            <div className="form-control">
                <label className="label">
                <span className="label-text">Usuario</span>
                </label>
                <input
                className="input input-bordered w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="form-control">
                <label className="label">
                <span className="label-text">Contraseña</span>
                </label>
                <input
                type="password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {error && <p className="text-error text-sm">{error}</p>}

            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
                {loading ? <><span className="loading loading-spinner loading-xs"></span> Entrando...</> : "Entrar"}
            </button>
            </form>
        </div>
        </div>
        
    );
};

export default LoginForm;
