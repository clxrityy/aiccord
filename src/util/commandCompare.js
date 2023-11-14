module.exports = (existingCommand, localCommand) => {
    const { name: existingName, description: existingDescription, options: existingOptions = [] } = existingCommand;
    const { data: {
        name: localName,
        description: localDescription,
        options: localOptions = []
    }, } = localCommand;

    const hasDifference = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

    const checkOptions = (existingOpts, localOpts) => {
        return localOpts.some((localOpt) => {
            const existingOpt = existingOpts.find((opt) => opt.name === localOpt.name);

            if (!existingOpt) return true;
            return hasDifference(localOpt, existingOpt);
        });
    };

    if (existingName !== localName || existingDescription !== localDescription || checkOptions(existingOptions, localOptions)) return true;

    return false;
}