// EditTalentModalWrapper.jsx
"use client"

import { useTalent } from "../contexts/talents-context"
import EditTalentModal from "./EditTalentModal"

export default function EditTalentModalWrapper() {
  const { isEditModalOpen, closeEditModal, editingTalentId, fetchTalents } = useTalent()

  const handleSave = (updatedTalent) => {
    // Atualizar a lista de talentos após a edição
    fetchTalents()
  }

  return (
    <EditTalentModal
      isOpen={isEditModalOpen}
      onClose={closeEditModal}
      talentId={editingTalentId}
      onSave={handleSave}
    />
  )
}