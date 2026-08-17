using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Club
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string PresidentName { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string ContactEmail { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}
