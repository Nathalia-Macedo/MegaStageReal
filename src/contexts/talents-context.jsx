// import { createContext, useContext, useState } from "react";
// import { useNotifications } from "./notification-context";

// const TalentContext = createContext();

// export const useTalent = () => useContext(TalentContext);

// export const TalentProvider = ({ children }) => {
//   const [token, setToken] = useState(() => localStorage.getItem("token"));
//   const [talents, setTalents] = useState([]); // Alterado de talentIds para talents
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedTalent, setSelectedTalent] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { notifyTalentUpdated, notifyTalentCreated, notifyTalentDeleted, notifyTalentHighlighted } =
//     useNotifications || {};

//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editingTalentId, setEditingTalentId] = useState(null);
//   const [loadingTalentId, setLoadingTalentId] = useState(null);

//   const fetchTalents = async () => {
//     setLoading(true);
//     setError(null);
//     console.log("Iniciando fetchTalents. Token:", token);

//     try {
//       const response = await fetch("https://megastage.onrender.com/api/v1/proxy/talents/", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("Resposta da API:", response.status, response.statusText);
//       if (!response.ok) {
//         throw new Error(`Erro ao buscar talentos: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Dados recebidos da API:", data);
//       setTalents(data); // Armazena os objetos completos
//       return data; // Retorna os objetos completos
//     } catch (error) {
//       console.error("Erro no fetchTalents:", error.message);
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//       console.log("Estado loading finalizado. Talents:", talents);
//     }
//   };

//   const fetchTalentById = async (id) => {
//     setLoadingTalentId(id);
//     setError(null);

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado");
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Erro ao buscar talento: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoadingTalentId(null);
//     }
//   };

//   const createTalent = async (talentData) => {
//     setLoading(true);
//     setError(null);

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado");
//       }

//       const apiTalentData = {
//         name: talentData.name,
//         birth_date: talentData.birth_date,
//         height: talentData.height,
//         eye_color: talentData.eye_color,
//         hair_color: talentData.hair_color,
//         can_sing: talentData.can_sing,
//         instruments: Array.isArray(talentData.instruments) ? talentData.instruments : [],
//         languages: Array.isArray(talentData.languages) ? talentData.languages : [],
//         ativo: talentData.ativo,
//         disponivel: talentData.disponivel,
//         data_disponibilidade: talentData.data_disponibilidade || "",
//         destaque: talentData.destaque,
//         category: "MEGASTAGE",
//         cover: talentData.cover,
//         instagram: talentData.instagram || "",
//         tipo_talento: talentData.type || "Ator",
//       };

//       const response = await fetch("https://megastage.onrender.com/api/v1/talents", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(apiTalentData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(`Erro ao criar talento: ${response.status} - ${errorData.message || ""}`);
//       }

//       const data = await response.json();
//       if (notifyTalentCreated) {
//         notifyTalentCreated(data);
//       }

//       await fetchTalents();
//       return data;
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateTalent = async (id, talentData, skipFetch = false) => {
//     setLoading(true);
//     setError(null);

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado");
//       }

//       const apiTalentData = {
//         name: talentData.name,
//         birth_date: talentData.birth_date,
//         height: talentData.height,
//         eye_color: talentData.eye_color,
//         hair_color: talentData.hair_color,
//         can_sing: talentData.can_sing,
//         instruments: Array.isArray(talentData.instruments) ? talentData.instruments : [],
//         languages: Array.isArray(talentData.languages) ? talentData.languages : [],
//         ativo: talentData.ativo,
//         disponivel: talentData.disponivel,
//         data_disponibilidade: talentData.data_disponibilidade || "",
//         destaque: talentData.destaque,
//         category: talentData.category,
//         cover: talentData.cover,
//         instagram: talentData.instagram || "",
//         tipo_talento: talentData.type || "Ator",
//       };

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(apiTalentData),
//       });

//       if (!response.ok) {
//         throw new Error(`Erro ao atualizar talento: ${response.status}`);
//       }

//       const data = await response.json();

//       if (notifyTalentUpdated) {
//         notifyTalentUpdated(data);
//       }

//       if (!skipFetch) {
//         await fetchTalents();
//       }

//       return data;
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteTalent = async (id) => {
//     setLoading(true);
//     setError(null);

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado");
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Erro ao excluir talento: ${response.status}`);
//       }

//       if (notifyTalentDeleted) {
//         notifyTalentDeleted(id);
//       }

//       setTalents(talents.filter((t) => t.id !== id)); // Atualiza o estado removendo o talento
//       return true;
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleHighlight = async (id, isHighlighted) => {
//     try {
//       const talent = await fetchTalentById(id);
//       const updateData = {
//         ...talent,
//         destaque: !isHighlighted,
//       };

//       const updatedTalent = await updateTalent(id, updateData, true);

//       if (notifyTalentHighlighted) {
//         notifyTalentHighlighted(updatedTalent);
//       }

//       return true;
//     } catch (error) {
//       console.error("Erro ao alternar destaque:", error);
//       throw error;
//     }
//   };

//   const importFromManager = async (incremental) => {
//     setLoading(true);
//     setError(null);

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado");
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/integration/${incremental}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Erro ao importar talentos do Manager: ${response.status}`);
//       }

//       const data = await response.json();
//       await fetchTalents();

//       return {
//         success: true,
//         message: incremental
//           ? `${data.imported || 0} novos talentos importados com sucesso!`
//           : `${data.imported || 0} talentos importados com sucesso!`,
//         count: data.imported || 0,
//       };
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addTalentPhotos = async (talentId, photosBase64) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado");
//       }

//       const photoData = {
//         photos: photosBase64.map((base64) => ({ image_base64: base64 })),
//       };

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(photoData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(`Erro ao adicionar fotos: ${response.status} - ${errorData.message || ""}`);
//       }

//       const data = await response.json();

//       if (notifyTalentUpdated) {
//         notifyTalentUpdated({ id: talentId });
//       }

//       return data;
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTalentPhotos = async (talentId) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado");
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/proxy/talents/${talentId}/photos`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Erro ao buscar fotos do talento: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteTalentPhoto = async (talentId, photoId) => {
//     setLoading(true);
//     setError(null);

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado");
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos/${photoId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Erro ao excluir foto: ${response.status}`);
//       }

//       if (notifyTalentUpdated) {
//         notifyTalentUpdated({ id: talentId });
//       }

//       return true;
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addTalentVideos = async (talentId, videoUrls) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado");
//       }

//       const formData = new FormData();
//       videoUrls.forEach((url) => {
//         formData.append("videos", url);
//       });

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/videos`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(`Erro ao adicionar vídeos: ${response.status} - ${errorData.message || ""}`);
//       }

//       const data = await response.json();

//       if (notifyTalentUpdated) {
//         notifyTalentUpdated({ id: talentId });
//       }

//       return data;
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTalentVideos = async (talentId) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado");
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/videos`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Erro ao buscar vídeos do talento: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteTalentVideo = async (talentId, videoId) => {
//     setLoading(true);
//     setError(null);

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado");
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/videos/${videoId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Erro ao excluir vídeo: ${response.status}`);
//       }

//       if (notifyTalentUpdated) {
//         notifyTalentUpdated({ id: talentId });
//       }

//       return true;
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openModal = (talent) => {
//     setSelectedTalent(talent);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setTimeout(() => {
//       setSelectedTalent(null);
//     }, 300);
//   };

//   const openEditModal = (id) => {
//     setEditingTalentId(id);
//     setIsEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setEditingTalentId(null);
//   };

//   const value = {
//     talents, // Expondo os dados completos
//     loading,
//     loadingTalentId,
//     error,
//     selectedTalent,
//     isModalOpen,
//     openModal,
//     closeModal,
//     fetchTalents,
//     fetchTalentById,
//     createTalent,
//     updateTalent,
//     deleteTalent,
//     toggleHighlight,
//     importFromManager,
//     isEditModalOpen,
//     editingTalentId,
//     openEditModal,
//     closeEditModal,
//     addTalentPhotos,
//     fetchTalentPhotos,
//     deleteTalentPhoto,
//     addTalentVideos,
//     fetchTalentVideos,
//     deleteTalentVideo,
//   };

//   return <TalentContext.Provider value={value}>{children}</TalentContext.Provider>;
// };



import { createContext, useContext, useState } from "react";
import { useNotifications } from "./notification-context";

const TalentContext = createContext();

export const useTalent = () => useContext(TalentContext);

export const TalentProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notifyTalentUpdated, notifyTalentCreated, notifyTalentDeleted, notifyTalentHighlighted } = useNotifications || {};
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTalentId, setEditingTalentId] = useState(null);
  const [loadingTalentId, setLoadingTalentId] = useState(null);

  const fetchTalents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://megastage.onrender.com/api/v1/proxy/talents/", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Erro ao buscar talentos: ${response.status}`);
      const data = await response.json();
      setTalents(data);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchTalentById = async (id) => {
    setLoadingTalentId(id);
    setError(null);
    try {
      if (!token) throw new Error("Token de autenticação não encontrado");
      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Erro ao buscar talento: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoadingTalentId(null);
    }
  };

  const createTalent = async (talentData) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error("Token de autenticação não encontrado");
      const apiTalentData = {
        name: talentData.name,
        birth_date: talentData.birth_date,
        height: talentData.height,
        eye_color: talentData.eye_color,
        hair_color: talentData.hair_color,
        can_sing: talentData.can_sing,
        instruments: Array.isArray(talentData.instruments) ? talentData.instruments : [],
        languages: Array.isArray(talentData.languages) ? talentData.languages : [],
        ativo: talentData.ativo,
        disponivel: talentData.disponivel,
        data_disponibilidade: talentData.data_disponibilidade || "",
        destaque: talentData.destaque,
        category: "MEGASTAGE",
        cover: talentData.cover,
        instagram: talentData.instagram || "",
        tipo_talento: talentData.type || "Ator",
      };
      const response = await fetch("https://megastage.onrender.com/api/v1/talents", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(apiTalentData),
      });
      if (!response.ok) throw new Error(`Erro ao criar talento: ${response.status}`);
      const data = await response.json();
      if (notifyTalentCreated) notifyTalentCreated(data);
      await fetchTalents();
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTalent = async (id, talentData, skipFetch = false) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error("Token de autenticação não encontrado");
      const apiTalentData = {
        name: talentData.name,
        birth_date: talentData.birth_date,
        height: talentData.height,
        eye_color: talentData.eye_color,
        hair_color: talentData.hair_color,
        can_sing: talentData.can_sing,
        instruments: Array.isArray(talentData.instruments) ? talentData.instruments : [],
        languages: Array.isArray(talentData.languages) ? talentData.languages : [],
        ativo: talentData.ativo,
        disponivel: talentData.disponivel,
        data_disponibilidade: talentData.data_disponibilidade || "",
        destaque: talentData.destaque,
        category: talentData.category,
        cover: talentData.cover,
        instagram: talentData.instagram || "",
        tipo_talento: talentData.type || "Ator",
      };
      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(apiTalentData),
      });
      if (!response.ok) throw new Error(`Erro ao atualizar talento: ${response.status}`);
      const data = await response.json();
      if (notifyTalentUpdated) notifyTalentUpdated(data);
      if (!skipFetch) await fetchTalents();
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTalent = async (id) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error("Token de autenticação não encontrado");
      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Erro ao excluir talento: ${response.status}`);
      if (notifyTalentDeleted) notifyTalentDeleted(id);
      setTalents(talents.filter((t) => t.id !== id));
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleHighlight = async (id, isHighlighted) => {
    try {
      const talent = await fetchTalentById(id);
      const updateData = { ...talent, destaque: !isHighlighted };
      const updatedTalent = await updateTalent(id, updateData, true);
      if (notifyTalentHighlighted) notifyTalentHighlighted(updatedTalent);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const importFromManager = async (incremental) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error("Token de autenticação não encontrado");
      const response = await fetch(`https://megastage.onrender.com/api/v1/integration/${incremental}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Erro ao importar talentos do Manager: ${response.status}`);
      const data = await response.json();
      await fetchTalents();
      return { success: true, message: incremental ? `${data.imported || 0} novos talentos importados com sucesso!` : `${data.imported || 0} talentos importados com sucesso!`, count: data.imported || 0 };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addTalentPhotos = async (talentId, files) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado");
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("release", "false");
      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erro ao adicionar fotos: ${response.status} - ${errorData.detail || ""}`);
      }
      const data = await response.json();
      if (notifyTalentUpdated) notifyTalentUpdated({ id: talentId });
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchTalentPhotos = async (talentId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado");
      const response = await fetch(`https://megastage.onrender.com/api/v1/proxy/talents/${talentId}/photos`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Erro ao buscar fotos do talento: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTalentPhoto = async (talentId, photoId) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error("Token de autenticação não encontrado");
      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos/${photoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Erro ao excluir foto: ${response.status}`);
      if (notifyTalentUpdated) notifyTalentUpdated({ id: talentId });
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addTalentVideos = async (talentId, videoUrls) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado");
      const formData = new FormData();
      videoUrls.forEach((url) => formData.append("videos", url));
      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/videos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erro ao adicionar vídeos: ${response.status} - ${errorData.message || ""}`);
      }
      const data = await response.json();
      if (notifyTalentUpdated) notifyTalentUpdated({ id: talentId });
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchTalentVideos = async (talentId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado");
      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/videos`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Erro ao buscar vídeos do talento: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTalentVideo = async (talentId, videoId) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error("Token de autenticação não encontrado");
      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/videos/${videoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Erro ao excluir vídeo: ${response.status}`);
      if (notifyTalentUpdated) notifyTalentUpdated({ id: talentId });
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const openModal = (talent) => {
    setSelectedTalent(talent);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTalent(null), 300);
  };

  const openEditModal = (id) => {
    setEditingTalentId(id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTalentId(null);
  };

  const value = {
    talents,
    loading,
    loadingTalentId,
    error,
    selectedTalent,
    isModalOpen,
    openModal,
    closeModal,
    fetchTalents,
    fetchTalentById,
    createTalent,
    updateTalent,
    deleteTalent,
    toggleHighlight,
    importFromManager,
    isEditModalOpen,
    editingTalentId,
    openEditModal,
    closeEditModal,
    addTalentPhotos,
    fetchTalentPhotos,
    deleteTalentPhoto,
    addTalentVideos,
    fetchTalentVideos,
    deleteTalentVideo,
  };

  return <TalentContext.Provider value={value}>{children}</TalentContext.Provider>;
};