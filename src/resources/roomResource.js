const roomResource = (room) => {
    return {
        id: room.id,
        name: room.name,
        created_at: room.created_at,
        updated_at: room.updated_at
    }
}

module.exports = { roomResource };