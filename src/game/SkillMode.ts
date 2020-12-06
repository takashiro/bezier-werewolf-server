const enum SkillMode {
	None,
	Read, // A skill that views some cards
	Write, // A skill that moves or changes some cards
	ReadWrite, // A skill that views and changes some cards
}

export default SkillMode;
