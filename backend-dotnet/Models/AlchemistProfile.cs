namespace PotionBrewery.Models;

public class AlchemistProfile
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string ServiceStartDate { get; set; } = "";
    public string? ProfileImage { get; set; }
    public int PotionsCompleted { get; set; }
}

public class AlchemistProfileCreate
{
    public string Name { get; set; } = "";
    public string? ServiceStartDate { get; set; }
}

public class AlchemistProfileUpdate
{
    public string? ServiceStartDate { get; set; }
    public string? ProfileImage { get; set; }
}
