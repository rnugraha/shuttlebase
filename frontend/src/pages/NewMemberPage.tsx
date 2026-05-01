import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";

export default function NewMemberPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		pronoun: "",
		dob: "",
		address: "",
		level: "BEGINNER",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await api.post("/members", form);
			navigate("/members");
		} catch (err: any) {
			const errors = err.response?.data?.errors;
			if (errors) {
				const first = Object.values(errors)[0] as string[];
				setError(first[0]);
			} else {
				setError(err.response?.data?.message || "Failed to create member");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Button variant="outline" onClick={() => navigate("/members")}>
						← Back
					</Button>
					<h1 className="text-2xl font-bold tracking-tight">Add member</h1>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First name</Label>
							<Input
								id="firstName"
								name="firstName"
								value={form.firstName}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last name</Label>
							<Input
								id="lastName"
								name="lastName"
								value={form.lastName}
								onChange={handleChange}
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="phone">Phone</Label>
							<Input
								id="phone"
								name="phone"
								value={form.phone}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="pronoun">Pronoun</Label>
							<Input
								id="pronoun"
								name="pronoun"
								placeholder="she/her, he/him, they/them"
								value={form.pronoun}
								onChange={handleChange}
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="dob">Date of birth</Label>
							<Input
								id="dob"
								name="dob"
								type="date"
								value={form.dob}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="level">Level</Label>
							<Select
								value={form.level}
								onValueChange={(value) => setForm({ ...form, level: value })}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="BEGINNER">Beginner</SelectItem>
									<SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
									<SelectItem value="ADVANCED">Advanced</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="address">Address</Label>
						<Input
							id="address"
							name="address"
							value={form.address}
							onChange={handleChange}
							required
						/>
					</div>

					{error && <p className="text-sm text-destructive">{error}</p>}

					<div className="flex gap-2 pt-2">
						<Button type="submit" disabled={loading}>
							{loading ? "Adding..." : "Add member"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate("/members")}
						>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
