var generateMessage =(from,msg) =>{
  return {
    from,
    msg
  };
};

var generateLocationMessage =(from,latitude,longitude) =>{
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`
  };
};
module.exports={generateMessage,generateLocationMessage};
