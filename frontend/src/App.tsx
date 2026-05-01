import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MembersPage from "./pages/MembersPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route
				path="/members"
				element={
					<ProtectedRoute>
						<MembersPage />
					</ProtectedRoute>
				}
			/>
			<Route path="*" element={<Navigate to="/members" />} />
		</Routes>
	);
}

export default App;
