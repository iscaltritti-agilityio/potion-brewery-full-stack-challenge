namespace PotionBrewery.Models;

public class PotionOrder
{
    public string Id { get; set; } = "";
    public string CustomerName { get; set; } = "";
    public string Location { get; set; } = "";
    public string Potion { get; set; } = "";
    public string AssignedAlchemist { get; set; } = "";
    public string Status { get; set; } = "";
    public string? Notes { get; set; }
}
