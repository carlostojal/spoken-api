
const formatRelation = (relation) => {
  return {
    user: {
      id: relation.user_id,
      name: relation.user_name,
      surname: relation.user_surname,
      username: relation.user_username
    },
    follows: {
      id: relation.follows_id,
      name: relation.follows_name,
      surname: relation.follows_surname,
      username: relation.follows_username
    },
    accepted: relation.accepted,
    create_time: relation.create_time
  };
};

module.exports = formatRelation;