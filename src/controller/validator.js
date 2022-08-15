
exports.isPlayerAdminOfClub = (req, res, club) => {
    // Check if user belongs to questioned club in DB
    const clubFound = req.user.clubs.find((userClub) => userClub.clubId.toString() === club.id);
    return clubFound && clubFound.role == 'admin';
};

exports.isPlayerInClub = (req, res, club) => {
    // Check if user belongs to questioned club in DB
    const clubFound = req.user.clubs.find((userClub) => userClub.clubId.toString() === club.id);
    return clubFound && true;
};