namespace PotionBrewery.Database;

public static class SampleData
{
    public const int ElixirCount = 47;

    public static readonly string[] SampleFirstNames =
    [
        "Aria", "Bjorn", "Celeste", "Dimitri", "Elowen",
        "Faelan", "Greta", "Hiro", "Isadora", "Jasper",
        "Katya", "Leander", "Mireille", "Nikos", "Ophelia",
        "Pavel", "Quinn", "Rosalind", "Soren", "Thalia"
    ];

    public static readonly string[] SampleLastNames =
    [
        "Ashford", "Blackwood", "Castellano", "Delacroix", "Evermore",
        "Fairchild", "Goldstein", "Hartwell", "Ironwood", "Jade",
        "Kingsley", "Lark", "Montague", "Nightingale", "Oakheart",
        "Peregrine", "Quill", "Ravenscroft", "Silverton", "Thornhill"
    ];

    public static readonly string[] SampleLocations =
    [
        "Tokyo, Japan", "New York, USA", "London, UK", "Paris, France",
        "Sydney, Australia", "Toronto, Canada", "Berlin, Germany", "Seoul, South Korea",
        "Mexico City, Mexico", "Amsterdam, Netherlands", "Stockholm, Sweden", "Dubai, UAE",
        "Buenos Aires, Argentina", "Cape Town, South Africa", "Singapore", "Mumbai, India",
        "Rome, Italy", "Bangkok, Thailand"
    ];

    public static readonly string[] ElixirTypes =
    [
        "Moonlight Healing Draught",
        "Essence of Restoration",
        "Phoenix Tear Elixir",
        "Bottled Sunrise Remedy",
        "Ancient Healing Tonic",
        "Silvervine Recovery Potion",
        "Golden Mend Mixture",
        "Starlight Healing Brew"
    ];

    public static readonly string[] NoteGreetings =
    [
        "Dear Alchemist,", "Hello!", "Greetings,", "Hi there,",
        "To whom it may concern,", "Good day,", "Hey,", "Salutations,"
    ];

    public static readonly string[] NoteRequests =
    [
        "I need this potion as soon as possible.",
        "Please make it extra strong.",
        "Could you add a hint of lavender?",
        "I'd like it in a blue bottle if possible.",
        "Please double the usual dosage.",
        "Can you make it taste like strawberries?",
        "I need the deluxe version please.",
        "Standard recipe is fine."
    ];

    public static readonly string[] NoteReasons =
    [
        "I have a tournament coming up.",
        "My grandmother is visiting next week.",
        "It's for my pet dragon.",
        "I'm going on an expedition.",
        "The last batch wore off too quickly.",
        "My whole village needs it.",
        "It's a birthday gift.",
        "I have an important duel tomorrow."
    ];

    public static readonly string[] NoteExtras =
    [
        "Also, do you offer loyalty discounts?",
        "P.S. Your last potion was magnificent!",
        "I'll pay extra for rush delivery.",
        "Can I get a receipt for tax purposes?",
        "My friend recommended your brewery.",
        "I've been a customer for 200 years.",
        "Please wrap it carefully, last time it exploded in transit.",
        "No eye of newt please, I'm allergic."
    ];

    public static readonly string[] NoteClosings =
    [
        "Thanks so much!", "With gratitude,", "Eagerly waiting,",
        "Best regards,", "Yours magically,", "Many thanks!",
        "Warmly,", "Cheers!"
    ];
}
