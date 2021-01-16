const enum MutexType {
	None,

	/**
	 * A special type to match all types.
	 */
	Any,

	/**
	 * A role card given to a player. The player thinks he is the role during the night phase.
	 */
	NotionalRole,

	/**
	 * A role card of a player or a center card. Some night-wake player can read or change it.
	 */
	ActualRole,
}

export default MutexType;
