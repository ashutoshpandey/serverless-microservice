exports.handler = async (event, context) => {
  const { title } = event.body;
  const now = new Date();

  const auction = {
    title,
    status: 'OPEN',
    createdAt: now.toISOString()
  };

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
};